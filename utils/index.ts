async function getAppVersionFromCommand(command: string) {
  const res = await execPromisified(command);
  const pattern = /\d+(\.\d+)+/;
  const match = res.stdout.match(pattern);
  if (!match) {
    return 'N/A';
  }
  return match[0];
}
