var active_item = null
var list_snapshot = []

buildList()

function buildList() {
    var wrapper = document.getElementById('list-wrapper')
    // wrapper.innerHTML = ''
    var url = '/api_todo/task_list/'

    fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
        console.log('Data :', data)

        var list = data

        for(var i in list){

            try{
                document.getElementById(`data-row-${i}`).remove()
            }catch(err){

            }

            var title = `<span class="title"><b>${list[i].title}</b></span>`
            if(list[i].complete == true){
                title = `<s style="color:red" class="title">${list[i].title}</s>`
            }
            var item = `
                <div id="data-row-${i}" class="task-wrapper flex-wrapper">
                    <div style="flex: 7">
                        ${title}
                    </div>
                    <div style="flex: 1">
                        <button class="btn btn-sm btn-outline-success edit">Edit</button>
                    </div>
                    <div style="flex: 1">
                        <button class="btn btn-sm btn-outline-danger delete">Delete</button>
                    </div>
                </div>
            `
            wrapper.innerHTML += item
        }

        if(list_snapshot.length > list.length){
            for(var i = list.length; i < list_snapshot.length; i++){
                document.getElementById(`data-row-${i}`).remove()
            }
        }
        list_snapshot = list
        
        for(var i in list){
            var edit_btn = document.getElementsByClassName('edit')[i]
            var delete_btn = document.getElementsByClassName('delete')[i]
            var title = document.getElementsByClassName('title')[i]

            edit_btn.addEventListener('click', (function(item){
                return function(){
                    editTask(item)
                }
            })(list[i]))

            delete_btn.addEventListener('click', (function(item) {
                return function(){
                    deleteTask(item)
                }
            })(list[i]))

            title.addEventListener('click', (function(item) {
                return function(){
                    strikeUnstrike(item)
                }
            })(list[i]))
        }
    })

}

var form = document.getElementById('form-wrapper')
form.addEventListener('submit', function(e){
    e.preventDefault()
    console.log('Form submitted')

    var url = '/api_todo/task_create/'
    if(active_item != null){
        url = `/api_todo/task_update/${active_item.id}/`
        active_item = null
    }
    var title = document.getElementById('title').value

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body:JSON.stringify({'title':title}),
    }).then(function(resp){
        buildList()
        document.getElementById('form').reset()
    })
})


function editTask(item) {
    console.log('edit task', item)
    active_item = item
    document.getElementById('title').value = active_item.title
}

function deleteTask(item) {
    console.log('delete', item)
    fetch(`/api_todo/task_delete/${item.id}/`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken,
        }
    }).then((response) => {
        buildList()
    })
}

function strikeUnstrike(item){
    console.log('strike', item)
    item.complete = !item.complete
    fetch(`/api_todo/task_update/${item.id}/`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
            'title': item.title,
            'complete': item.complete,
        })
    }).then((response) => {
        buildList()
    })
}