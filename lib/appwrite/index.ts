// import { cookies } from 'next/headers';
// import { Account, Client, Databases, Avatars } from 'node-appwrite';
// import { appwriteConfig } from '@/lib/config/appwrite';
// export const createSessionClient = async () => {
//   const client = new Client()
//     .setEndpoint(appwriteConfig.endpointUrl)
//     .setProject(appwriteConfig.projectId);

//     const session =  (await cookies()).get(args: 'appwrite-session');
//     if(!session || !session.value) throw new Error(message: 'No session');
//     client.setSession(session.value);

//     return {
//         get account() {
//             return new Account(client);
//         },
//         get database() {
//             return new Databases(client);
//         }
//     }
// };

//  const createAdminClient = async () => {
//   const client = new Client()
//     .setEndpoint(appwriteConfig.endpointUrl)
//     .setProject(appwriteConfig.projectId);
//      .setKey(appwriteConfig.secretKey);

//     return {
//         get account() {
//             return new Account(client);
//         },
//         get database() {
//             return new Databases(client);
//         },
//         get storage() {
//             return new Storage(client);
//         },
//         get avatars() {
//             return new Avatars(client);
//         }
//     }
// };

// export const  createAdminClient = async () =>  {...};
'use server';

import { Account, Avatars, Client, Databases, Storage } from 'node-appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { cookies } from 'next/headers';

export const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

  const session = (await cookies()).get('appwrite-session');

  if (!session || !session.value) throw new Error('No session');

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
};

export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.secretKey);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
};
