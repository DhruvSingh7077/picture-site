import React from 'react';
import Thumbnail from './Thumbnail';
import { Models } from 'node-appwrite';
import Link from 'next/link';
const Card = ({ file }: { file: Models.Document }) => {
  return (
    <Link href={file.url} target="_blank" className="file-card">
      <div className="flex justify-between">
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={file.url}
          className="!size-20"
          imageClassName="!size-11"
        />
        <div className="flex flex-col items-end justify-between"></div>
      </div>
      {file.name}
    </Link>
  );
};

export default Card;
