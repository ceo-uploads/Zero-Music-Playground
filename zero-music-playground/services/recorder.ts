
export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private stream: MediaStream | null = null;

  constructor(stream: MediaStream) {
    this.stream = stream;
  }

  start() {
    if (!this.stream) return;
    this.chunks = [];
    this.mediaRecorder = new MediaRecorder(this.stream);
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data);
    };
    this.mediaRecorder.start();
  }

  stop(): Promise<string> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) return resolve('');
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        resolve(url);
      };
      this.mediaRecorder.stop();
    });
  }
}
