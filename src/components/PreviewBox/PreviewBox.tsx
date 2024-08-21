import { FileData } from '@/types/data.types'
import MuxPlayer from '@mux/mux-player-react'
import { Image } from '@nextui-org/image'
import { Card, CardBody } from '@nextui-org/react'
import { useMemo } from 'react'

export const PreviewBox: React.FC<Partial<FileData>> = ({
  url,
  type,
  name,
  excerpt,
}) => {
  const playBackId = useMemo<string>(() => {
    if (type === 'video' && url) {
      const urlToken = url.split('/')
      return urlToken.length > 3 ? urlToken[3] : ''
    }
    return ''
  }, [url])

  return (
    <Card isBlurred shadow="sm" className="mx-10">
      <CardBody>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
          <div className="relative col-span-6 md:col-span-4">
            {type === 'image' && <Image alt={name} src={url} />}
            {type === 'video' && <MuxPlayer playbackId={playBackId} />}
          </div>
          <div className="flex flex-col col-span-6 md:col-span-8">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-0">
                <h3 className="font-semibold text-foreground/90">{name}</h3>
                <p className="text-small text-foreground/80">12 Tracks</p>
                <h1 className="text-large font-medium mt-2">
                  {excerpt || 'No summary has been provided'}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
