import { useState } from "react";

export default function CreateAccount() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>CreateAccount page</p>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
