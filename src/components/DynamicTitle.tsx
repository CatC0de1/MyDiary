import { useEffect } from "react";
import { Window } from "@tauri-apps/api/window";

type Props = {
  title?: string | null;
}

function DynamicTitle({ title }: Props) {
  useEffect(() => {
    async function setWindowTitle() {      
      const win = await Window.getCurrent();
      if (title && title.trim() !== "") {
        win.setTitle(`MyDiary - ${title}`);
      } else if (title === null) {
        win.setTitle("MyDiary");
      }
    }
    setWindowTitle();
  }, [title]);

  return null;
}

export default DynamicTitle;