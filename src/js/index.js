let addButton = document.getElementById('addButton')
let searchField = document.getElementById('searchField')
let taskModal = document.getElementById('taskModal')
let closeButton = document.getElementById('closeButton')

addButton.addEventListener('click', () => {
  let paragraphId = document.getElementById('paragraphId')
  paragraphId.innerHTML = 'Add Task'
  taskModal.classList.remove('hidden')
})
closeButton.addEventListener('click', () => {
  taskModal.classList.add('hidden')
})
let array = JSON.parse(localStorage.getItem('task')) || []
let titleField = document.getElementById('titleField')
let descriptionField = document.getElementById('descriptionField')
let saveButton = document.getElementById('saveButton')
let taskStatus = document.getElementById('taskStatus')

saveButton.addEventListener('click', () => {
  if (
    titleField.value !== '' &&
    descriptionField.value !== '' &&
    taskStatus.value !== ''
  ) {
    let index = saveButton.getAttribute('index')
    let task = {
      title: titleField.value,
      description: descriptionField.value,
      status: taskStatus.value
    }
    if (index == null) {
      array.unshift(task)
    } else {
      array.splice(index, 1)
      array.push(task)
    }
    localStorage.setItem('task', JSON.stringify(array))
    taskModal.classList.add('hidden')
    titleField.value = ''
    descriptionField.value = ''
    taskStatus.value = ''
    displayTask()
  } else {
    alert('Please fill all the fields')
  }
})
let todoList = document.getElementById('todoList')
let inprogressList = document.getElementById('inProgressList')
let completedList = document.getElementById('completedList')

function displayTask (task = array) {
  todoList.innerHTML = ''
  inprogressList.innerHTML = ''
  completedList.innerHTML = ''
  // let savedData=JSON.parse(localStorage.getItem('task'))
  task.forEach((data, index) => {
    let containerElement = document.createElement('div')
    containerElement.setAttribute('index', index)
    containerElement.setAttribute('draggable', true)
    containerElement.classList.add('task')
    containerElement.innerHTML = `
            <div class="bg-white-100 p-4 rounded-lg shadow-lg">
                <h3 class="font-semibold">${data.title}</h3>
                <p>${data.description}</p>
                <button  class="deleteButton bg-red-500 text-white px-4 py-2 rounded-lg mt-4">Delete</button>
                </div>
            `
    let draggedElement = null
    containerElement.addEventListener('dragstart', event => {
      draggedElement = containerElement
      event.dataTransfer.setData('index', index)
      event.dataTransfer.setData('status', data.status)
      setTimeout(() => {
        draggedElement.style.opacity = '0.5'
      }, 0)
    })
    containerElement.addEventListener('dragend', () => {
      if (draggedElement) {
        draggedElement.style.opacity = '1'
        draggedElement = null
      }
    })

    containerElement.addEventListener('click', () => {
      let paragraphId = document.getElementById('paragraphId')
      titleField.value = data.title
      descriptionField.value = data.description
      taskStatus.value = data.status
      paragraphId.innerText = 'update task'
      saveButton.setAttribute('index', index)

      taskModal.classList.remove('hidden')
    })

    if (data.status == 'todo') {
      todoList.appendChild(containerElement)
    } else if (data.status == 'inprogress') {
      inprogressList.appendChild(containerElement)
    } else {
      completedList.appendChild(containerElement)
    }

    let container = containerElement.querySelector('.deleteButton')
    container.addEventListener('click', event => {
      event.stopPropagation()
      array.splice(index, 1)
      localStorage.setItem('task', JSON.stringify(array))
      displayTask()
    })
  })
}
displayTask()

searchField.addEventListener('keyup', () => {
  let data = searchField.value.toLowerCase()
  let saveButton = JSON.parse(localStorage.getItem('task'))
  let filteredTask = saveButton.filter(task =>
    task.title.toLowerCase().includes(data)
  )
  displayTask(filteredTask)
})
document.addEventListener('dragover', event => {
  event.preventDefault()
})
document.addEventListener('drop', event => {
  event.preventDefault()
  let index = parseInt(event.dataTransfer.getData('index'))
  let newStatus = getDropTarget(event.clientX, event.clientY)
  if (!newStatus) {
    return
  }
  if (newStatus && array[index].status !== newStatus) {
    array[index].status = newStatus
    localStorage.setItem('task', JSON.stringify(array))
    displayTask()
  } else if (newStatus && array[index].status === newStatus) {
    let targe = event.target.closest('.task')
    let targetIndex = parseInt(targe.getAttribute('index'))
    let temp = array[targetIndex]
    array[targetIndex] = array[index]
    array[index] = temp
    localStorage.setItem('task', JSON.stringify(array))
    displayTask()
  }
})
function getDropTarget (clientX, clientY) {
  let lists = [todoList, inprogressList, completedList]
  let statuses = ['todo', 'inprogress', 'completed']
  for (let i = 0; i < lists.length; i++) {
    let rect = lists[i].getBoundingClientRect()
    if (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    ) {
      return statuses[i]
    }
  }
  return null
}
