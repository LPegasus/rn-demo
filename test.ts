async function* login(): AsyncIterator<'cooldown' | number, void, Promise<void> | void> {
  let i = 6;
  while (i > 0) {
    i--;
    await sleep();
    yield i;
  }
  await (yield "cooldown");
  throw new Error("err test");

  console.log("end");
}

async function sleep() {
  return new Promise((r) => setTimeout(r, 1000));
}

const g = login();
try {
  for (; ;) {
    const { done, value } = await g.next();
    if (done) {
      break;
    }
    if (value === "cooldown") {
      await sleep();
      console.log("sleep 1");
      await sleep();
      console.log("sleep 2");
      await sleep();
      console.log("sleep 3");
    } else {
      console.log(value);
    }
  }
} catch (e) {
  console.error(e);
}
