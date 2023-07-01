import { Router } from "preact-router";
import { Index } from "./routes";
import { Chat } from "./routes/chat";

export function App() {
  return <Router>
    <Index path='/' />
    <Chat path='/chat' />
  </Router>
}