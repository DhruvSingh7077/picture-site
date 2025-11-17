'use client';
import React from 'react';
import { sortTypes } from '@/constants';
import { useRouter, usePathname } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
const Sort = () => {
  const router = useRouter();
  const path = usePathname();
  const handleSort = (value: string) => {
    router.push(`${path}?sort=${value}`);
  };
  return (
    <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
      <SelectTrigger className="sort-select">
        <SelectValue placeholder={sortTypes[0].value} />
      </SelectTrigger>
      <SelectContent className="sort-select-content">
        {sortTypes.map((sort) => (
          <SelectItem key={sort.label} className="shad-select-item" value={sort.value}>
            {sort.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Sort;
