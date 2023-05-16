import { DirectoryResponse, FileResponse, FsCommand, QueryCommandResponse, queryFileSystem } from "~/fileBindings";

type UnknownFileType = { file?: FileResponse; directory?: DirectoryResponse };
function expectNoNull(response: QueryCommandResponse | null) {
  if (response === null) {
    throw new Error("Unexpected null response from queryFileSystem");
  }
  return response;
}

function expectNull(response: QueryCommandResponse | null) {
  if (response !== null) {
    throw new Error(`Unexpected response from queryFileSystem: ${JSON.stringify(response)}`);
  }
  return null;
}
function handleUnknownFileType(result: QueryCommandResponse): UnknownFileType {
  if ("directory" in result) {
    return { directory: result.directory as DirectoryResponse, file: undefined };
  }
  if ("file" in result) {
    return { directory: undefined, file: result.file as FileResponse };
  }
  return result;
}

export function getRootCommand(): FsCommand {
  return "queryRoot";
}

export function getPathCommand(path: string): FsCommand {
  return { queryPath: { path } };
}

export async function queryRootDirectory(): Promise<{ directory: DirectoryResponse }> {
  const result = await queryFileSystem(getRootCommand()).then(expectNoNull);
  if ("directory" in result) {
    return { directory: result.directory as DirectoryResponse };
  }
  throw new Error("Expected directory response for root query");
}

export async function queryPath(path: string): Promise<UnknownFileType> {
  return await queryFileSystem(getPathCommand(path)).then(expectNoNull).then(handleUnknownFileType);
}

export function touchFile(parentDir: string, fileName: string): Promise<UnknownFileType> {
  return queryFileSystem({ touchFile: { parentDir, name: fileName } })
    .then(expectNoNull)
    .then(handleUnknownFileType);
}

export function touchDirectory(parentDir: string, dirName: string): Promise<UnknownFileType> {
  return queryFileSystem({ touchDirectory: { parentDir, name: dirName } })
    .then(expectNoNull)
    .then(handleUnknownFileType);
}

export function deletePath(path: string): Promise<null> {
  return queryFileSystem({ deletePath: { path } }).then(expectNull);
}

export function renamePath(from: string, to: string): Promise<null> {
  return queryFileSystem({ renamePath: { from, to } }).then(expectNull);
}
