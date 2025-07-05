import { useFetcher, useParams, useSearchParams } from "react-router"
import { Button } from "./button"

export const Pagination = () => {
  const params = useParams<{ username: string }>()
  const fetcher = useFetcher()
  const [searchParams] = useSearchParams()
  const page = searchParams.get("page") || 1
  const perPage = searchParams.get("per_page") || 10

  return (
    <div className="flex justify-end gap-2">
      <fetcher.Form action={`/detail/${params.username}`} method="get">
        <Button
          variant="outline"
          className="cursor-pointer"
          disabled={+page === 1}
        >
          Previous
        </Button>
        <input type="hidden" name="page" value={+page - 1} />
        <input type="hidden" name="per_page" value={perPage} />
      </fetcher.Form>
      <fetcher.Form action={`/detail/${params.username}`} method="get">
        <input type="hidden" name="page" value={+page + 1} />
        <input type="hidden" name="per_page" value={perPage} />
        <Button variant="outline" className="cursor-pointer">
          Next
        </Button>
      </fetcher.Form>
    </div>
  )
}
