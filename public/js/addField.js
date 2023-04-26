const button = document.querySelector("#add-time")

button.addEventListener("click", () => {
  const scheduleList = document.querySelector("#schedule-items")
  const scheduleItem = scheduleList.querySelector(".schedule-item:last-child")

  // Clona o .schedule-item
  const clonedScheduleItem = scheduleItem.cloneNode(true)

  // Limpa os inputs
  const inputs = clonedScheduleItem.querySelectorAll("input")
  for (const input of inputs) {
    input.value = ""
  }

  // Insere + 1 .schedule-item na lista
  scheduleList.appendChild(clonedScheduleItem)
})
