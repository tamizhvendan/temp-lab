import { Link, useFetcher } from "react-router";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import type { Route } from "../+types/root";

export async function clientLoader() {
  const res = await fetch(`/api/job-boards`);
  const jobBoards = await res.json();
  return {jobBoards}
}

export async function clientAction({ request}: Route.ClientActionArgs) {
  const formData = await request.formData()
  await fetch(`/api/job-boards/${formData.get('job_board_id')}`, {
    method: 'DELETE',
    body: formData,
  })
} 

export default function JobBoards({loaderData}) {
  const fetcher = useFetcher();

  return (
    <div>
      <div className="float-right">
        <Button>
          <Link to="/job-boards/new">Add New Job Board</Link>
        </Button>
      </div>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {loaderData.jobBoards.map(
            (jobBoard) =>
              <TableRow key={jobBoard.id}>
                <TableCell>
                  {jobBoard.logo_url
                  ?  <Avatar><AvatarImage src={jobBoard.logo_url}></AvatarImage></Avatar>
                  : <></>}
                </TableCell>
                <TableCell><Link to={`/job-boards/${jobBoard.id}/job-posts`} className="capitalize">{jobBoard.slug}</Link></TableCell>
                <TableCell className="flex space-x-2">
                  <Link to={`/job-boards/${jobBoard.id}/edit`}>Edit</Link>
                  <fetcher.Form method="post"
                    onSubmit={(event) => {
                      const response = confirm(
                        "Please confirm you want to delete this record.",
                      );
                      if (!response) {
                        event.preventDefault();
                      }
                    }}>
                    <input name="job_board_id" type="hidden" value={jobBoard.id}></input>
                    <button>Delete</button>
                  </fetcher.Form>
                </TableCell>
              </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}