import { FileData } from '@/types/data.types'
import { unbody } from './unbody.client'

export type ApiSearchParams = {
  query: string
  filters?: string[]
}
export type ApiSearchResponse = {
  files: FileData[]
  query: string
}
export const searchApi = async ({
  query,
  filters = [],
}: ApiSearchParams): Promise<ApiSearchResponse> => {
  const queries = []

  if (!filters.length || filters.includes('document')) {
    queries.push(
      unbody.get.googleDoc.select(
        '__typename',
        'originalName',
        'autoSummary',
        'autoKeywords',
        'path',
      ),
      unbody.get.textDocument.select(
        '__typename',
        'originalName',
        'autoKeywords',
        'path',
        'ext' as any,
      ),
    )
  }

  if (!filters.length || filters.includes('video')) {
    queries.push(
      unbody.get.videoFile.select(
        '__typename',
        'originalName',
        'autoKeywords',
        'path',
        'ext',
        'animatedImageUrl.webp',
        'autoSummary',
      ),
    )
  }

  if (!filters.length || filters.includes('audio')) {
    queries.push(
      unbody.get.audioFile.select(
        '__typename',
        'originalName',
        'autoKeywords',
        'path',
        'ext',
      ),
    )
  }

  if (!filters.length || filters.includes('image')) {
    queries.push(
      unbody.get.imageBlock.select(
        '__typename',
        'originalName',
        'autoCaption',
        'autoTypes',
        'autoOCR',
        'path',
        'ext',
        'url',
      ),
    )
  }

  const preparedQueries = queries
    .map((q) => q.additional('id').limit(10))
    .map((q) =>
      query.trim().length === 0
        ? (q as any).where(({ GreaterThan }: any) => ({
            pathString: GreaterThan('/'),
          }))
        : q.search.about(query, { certainty: 0.65 }),
    )

  const results = await unbody.exec(...preparedQueries)

  const files: FileData[] = []

  results.data
    .flatMap((res) => res.payload)
    .forEach((file) => {
      const {
        _additional,
        __typename,
        originalName,
        path = [],
        ext,
        autoKeywords,
        autoCaption,
        autoSummary,
        autoTypes,
        url,
        animatedImageUrl,
      } = file

      let type: FileData['type'] = 'document'

      if (__typename === 'GoogleDoc' || __typename === 'TextDocument') {
        type = ext === 'pdf' ? 'pdf' : 'document'
      } else if (__typename === 'VideoFile') {
        type = 'video'
      } else if (__typename === 'AudioFile') {
        type = 'audio'
      } else if (__typename === 'ImageBlock') {
        type = 'image'
      } else return

      files.push({
        id: _additional.id,
        type,
        name: originalName,
        extension: ext,
        excerpt: (type === 'image' ? autoCaption : autoSummary) || '',
        tags: (type === 'image' ? autoTypes : autoKeywords) || [],
        path: (path || []).slice(1, (path || []).length - 1),
        metadata: {
          id: _additional.id,
          __typename: __typename,
        },
        url: type === 'video' ? animatedImageUrl.webp : url,
      })
    })

  return {
    files,
    query,
  }
}
