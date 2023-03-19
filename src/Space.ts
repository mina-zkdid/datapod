interface Space {
  openDocument(path: string): Promise<Document>;
  removeDocument(path: string): Promise<void>;
  getDocument(path: string): Promise<Document>;
}

class Space implements Space {
  async openDocument(path: string): Promise<Document> {
    const document = await this.getDocument(path);
    if (document) {
      return document;
    }
    return new Document();
  }
}
