'use server';

import { createAdminClient, createSessionClient } from '@/lib/appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Query, ID } from 'node-appwrite';
import { parseStringify } from '@/lib/utils';
import { cookies } from 'next/headers';
import { avatarPlaceholderUrl } from '@/constants';
import { redirect } from 'next/navigation';

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  console.log('Loaded environment variables:', {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
    project: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
    usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION,
    filesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION,
    secretKey: process.env.APPWRITE_SECRET_KEY,
  });

  console.log('getUserByEmail databaseId:', appwriteConfig.databaseId);
  console.log('getUserByEmail usersCollectionId:', appwriteConfig.usersCollectionId);

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal('email', [email])],
  );

  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    handleError(error, 'Failed to send email OTP');
  }
};

export const createAccount = async ({ fullName, email }: { fullName: string; email: string }) => {
  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP({ email });
  if (!accountId) throw new Error('Failed to send an OTP');

  if (!existingUser) {
    const { databases } = await createAdminClient();

    console.log('createAccount databaseId:', appwriteConfig.databaseId);
    console.log('createAccount usersCollectionId:', appwriteConfig.usersCollectionId);

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar: avatarPlaceholderUrl,
        accountid: accountId,
      },
    );
  }

  return parseStringify({ accountId });
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, password);

    (await cookies()).set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, 'Failed to verify OTP');
  }
};

export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();

    const result = await account.get();

    console.log('getCurrentUser databaseId:', appwriteConfig.databaseId);
    console.log('getCurrentUser usersCollectionId:', appwriteConfig.usersCollectionId);

    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal('accountid', result.$id)],
    );

    if (user.total <= 0) return null;

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession('current');
    (await cookies()).delete('appwrite-session');
  } catch (error) {
    handleError(error, 'Failed to sign out user');
  } finally {
    redirect('/sign-in');
  }
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);

    // User exists, send OTP
    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({ accountId: existingUser.accountid });
    }

    return parseStringify({ accountId: null, error: 'User not found' });
  } catch (error) {
    handleError(error, 'Failed to sign in user');
    return { accountId: null, error: 'Sign in failed' };
  }
};

// DEMO LOGIN (NO OTP REQUIRED)
export const demoLogin = async () => {
  try {
    const { account, databases } = await createAdminClient();

    // 1. Create anonymous session
    const session = await account.createAnonymousSession();

    // 2. Set cookie
    (await cookies()).set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    // 3. Check if demo document exists
    const demoUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal('accountid', session.userId)],
    );

    // 4. If not, create demo user in DB
    if (demoUser.total === 0) {
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        ID.unique(),
        {
          fullName: 'Demo User',
          email: 'demo@demo.com',
          avatar: 'https://avatar.iran.liara.run/public',
          accountid: session.userId,
        },
      );
    }

    return { success: true };
  } catch (error) {
    console.log('Demo login failed:', error);
    return { success: false };
  }
};
