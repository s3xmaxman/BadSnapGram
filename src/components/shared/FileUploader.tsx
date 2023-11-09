import {useState ,useCallback} from 'react'
import {useDropzone, FileWithPath} from 'react-dropzone'
import { Button } from '../ui/button'



type FileUploaderProps = {
    filedChange: (FILES:File[]) => void;
    mediaUrl: string;

}

const FileUploader = ({ filedChange, mediaUrl }: FileUploaderProps) => {
    const [file, setFile] = useState<File[]>([]) 
    const [fileUrl, setFileUrl] = useState(mediaUrl) 

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setFile(acceptedFiles) // 受け入れられたファイルをstateに設定
        filedChange(acceptedFiles) // filedChange関数を呼び出し、ファイルの変更を処理
        setFileUrl(URL.createObjectURL(acceptedFiles[0])) // 受け入れられたファイルのURLをstateに設定
    }, [file])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop, // onDrop関数を指定
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.svg'],
            'video/*': ['.mp4'],
        }
    })

  return (
    <div {...getRootProps()} className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer'>
        <input {...getInputProps()} className='cursor-pointer' />
        {
           fileUrl ? (
            <>
            <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>
                <img 
                    src={fileUrl}
                    alt="image"
                    className='file_uploader-img'
                />
                <video controls>
                    <source src={fileUrl} type="video/mp4" />
                </video>
            </div>
            <p className='file_uploader-label'>
                写真をクリックまたはドラッグして置き換え
            </p>
            </>
           ) : (
            <div className='file_uploader-box'>
                <img 
                    src="/assets/icons/file-upload.svg" 
                    alt="file-upload"
                    width={96}
                    height={77} 
                />
                <h3 className='base-medium text-light-2 mb-2 mt-6'>写真をアップロードする</h3>
                <p className='text-light-4 small-regular mb-6'>SVG PNG JPG</p>
                <Button className='shad-button_dark_4'>
                   ファイルを選択する
                </Button>
            </div>
           )     
        }
    </div>
  )
}

export default FileUploader