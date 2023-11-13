import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

import { convertFileToUrl } from "@/lib/utils";

type ProfileUploaderProps = {
  fieldChange: (files: File[]) => void; 
  mediaUrl: string;
};

const ProfileUploader = ({ fieldChange, mediaUrl }: ProfileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]) 
  const [fileUrl, setFileUrl] = useState(mediaUrl) 

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles) // 受け入れられたファイルをstateに設定
      fieldChange(acceptedFiles) // filedChange関数を呼び出し、ファイルの変更を処理
      setFileUrl(convertFileToUrl(acceptedFiles[0])) // 受け入れられたファイルのURLをstateに設定
  }, [file])

  const { getRootProps, getInputProps } = useDropzone({
      onDrop, // onDrop関数を指定
      accept: {
          'image/*': ['.png', '.jpg', '.jpeg', '.svg'], // 受け入れるファイルの種類と拡張子を指定
      }
  })
  
  console.log(fileUrl)
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} className="cursor-pointer" />

      <div className="cursor-pointer flex-center gap-4">
        <img
          src={fileUrl || "/assets/icons/profile-placeholder.svg"}
          alt="image"
          className="h-24 w-24 rounded-full object-cover object-top"
        />
        <p className="text-primary-500 small-regular md:base-semibold">
          写真を変更
        </p>
      </div>
    </div>
  );
};

export default ProfileUploader;