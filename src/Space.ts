interface Space {
  openDocument(path: string): Promise<Document>;
  removeDocument(path: string): Promise<void>;
  getDocument(path: string): Promise<Document>;
}
