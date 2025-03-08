import path from "node:path";

class Store {
  /**
   * outputDirectory
   */
  private _outputDirectory = "";

  set outputDirectory(value: string) {
    this._outputDirectory = value;
  }

  get outputDirectory() {
    return this._outputDirectory;
  }

  /**
   * hostDirectory
   */
  private _hostDirectory = "";

  set hostDirectory(value: string) {
    this._hostDirectory = value;
  }

  get hostDirectory() {
    return this._hostDirectory;
  }

  /**
   * storiesDirectory
   */
  get storiesDirectory() {
    return path.join(this.hostDirectory, this.outputDirectory);
  }

  /**
   * relativePathStoriesDirectoryToHost
   */
  get relativePathStoriesDirectoryToHost() {
    return this.outputDirectory
      .split("/")
      .map(() => "..")
      .join("/");
  }

  /**
   * componentRelativePathToStoriesDirectory
   */
  componentRelativePathToStoriesDirectory(filePath: string) {
    return path.join(
      this.relativePathStoriesDirectoryToHost,
      filePath.replace(this.hostDirectory, ""),
    );
  }
}

export const store = new Store();
