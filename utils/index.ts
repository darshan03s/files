async function getAppVersionFromCommand(command: string) {
  const res = await execPromisified(command);
  const pattern = /\d+(\.\d+)+/;
  const match = res.stdout.match(pattern);
  if (!match) {
    return 'N/A';
  }
  return match[0];
}

async function listSubfolderNames(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });

  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}
