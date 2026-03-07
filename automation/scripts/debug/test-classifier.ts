import { classifyTicket } from "../../ai/classifier"

async function run() {

  const result = await classifyTicket(
    "Server down urgent",
    "Production API returns 500 error"
  )

  console.log("Classification result:")
  console.log(result)

}

run()