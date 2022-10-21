const capture = require("capture-website")

const get = async () => {
  try {
    console.log("capturing")
    await capture.file("http://localhost:3000?screenshot=1", `./img/${Math.random().png}`, {
      height: 380,
      width: 420,
    })
    console.log("success")
  } catch (e) {
    console.log(e)
  }
}

get()
