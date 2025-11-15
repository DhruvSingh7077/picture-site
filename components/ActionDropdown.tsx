'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Models } from 'node-appwrite';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { actionsDropdownItems } from '@/constants/actionsDropdownItems';
const ActionDropdown = ({ file }: { file: Models.Document }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setisDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  return (
    <Dialog open={isModalOpen} onOpenChange={setisModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setisDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image src="/assets/icons/dots.svg" alt="dots" width={34} height={34} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">{file.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem key={actionItem.value} className="shad-dropdown-item" onClick={() =>
            setAction(actionItem);
            if (
              ["rename",
                "share",
                "delete",
                "details"].includes(actionItem.value),
              
            )
            {
              setIsModalOpen(true);
            }
            }> <Link href={constructDownloadUrl(file.bucketField)}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
};

export default ActionDropdown;
