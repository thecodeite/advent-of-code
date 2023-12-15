import express from "express";

export function host(path: string, port: number) {
  const app = express();
  app.use(express.static(path));
  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
}
