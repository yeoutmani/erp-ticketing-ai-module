import request from "supertest"
import { app } from "../../automation/server"

jest.mock("../../automation/ai/classifier", () => ({
  classifyTicket: jest.fn().mockResolvedValue({
    priority: "high",
    category: "incident",
    confidence: 0.9
  })
}))

describe("POST /automation/classify", () => {

  it("returns classification result", async () => {

    const res = await request(app)
      .post("/automation/classify")
      .send({
        title: "Server down",
        description: "Production outage"
      })

    expect(res.status).toBe(200)

    expect(res.body).toEqual({
      priority: "high",
      category: "incident",
      confidence: 0.9
    })

  })
    
  it("returns 500 if classification fails", async () => {

    jest.spyOn(require("../../automation/ai/classifier"), "classifyTicket")
        .mockRejectedValue(new Error("AI failure"))

    const res = await request(app)
        .post("/automation/classify")
        .send({
        title: "Server down",
        description: "Production outage"
        })

    expect(res.status).toBe(500)

    expect(res.body).toEqual({
        error: "classification_failed"
    })

  })

})