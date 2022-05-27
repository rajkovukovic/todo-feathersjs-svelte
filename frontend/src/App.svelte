<script>
  import { onMount } from "svelte";
  import { todoService } from "./client";
  import Todo from "./views/Todo.svelte";

  let todos = [];
  let selectedIds = new Set();
  let todoInputValue = "";

  onMount(async () => {
    todos = (await todoService.find()).data;
  });

  function handleCreated(data) {
    todos = [...todos, data];
  }

  function handleUpdated(data) {
    todos = todos.map((todo) => (todo._id === data._id ? data : todo));
  }

  function handleDeleted(data) {
    todos = todos.filter((todo) => todo._id !== data._id);
  }

  todoService.on("created", handleCreated);

  todoService.on("updated", handleUpdated);

  todoService.on("deleted", handleDeleted);

  function addTodo() {
    todoService
      .create({
        name: todoInputValue,
      })
      .then(handleCreated);
    todoInputValue = "";
  }

  function handleSelect(todo) {
    if (selectedIds.has(todo._id)) {
      selectedIds.delete(todo._id);
    } else {
      selectedIds.add(todo._id);
    }
    selectedIds = selectedIds;
  }

  function handleToggle(todo) {
    todoService
      .patch(todo._id, { completed: !todo.completed })
      .then(handleUpdated);
  }

  function handleDeleteSelected() {
    [...selectedIds].forEach((id) =>
      todoService.remove(id).then(handleDeleted)
    );
    selectedIds = new Set();
  }

  $: console.log(todos);
</script>

<div class="container-fluid">
  <div
    class="row justify-content-center align-items-center"
    style="min-height: 100vh;"
  >
    <div class="col-12 col-sm-8 col-md-6 col-xl-4 p-3">
      <div class="card border-0 shadow" style="max-height: 80vh;">
        <div class="card-header border-0 bg-white">
          <div class="d-flex align-items-center text-muted">
            <small class="mx-1" id="box-completed" />
            <small class="mx-1" id="box-pending" />
            <small class="mx-1" id="box-total" />
            <span class="spacer" />
            <button
              class="btn btn-remove rounded-pill border-0"
              disabled={selectedIds.size === 0}
              on:click={handleDeleteSelected}
            >
              <i class="bx bx-trash" />
            </button>
          </div>
        </div>
        <div class="card-body">
          <ul class="list-group" id="container">
            {#each todos as todo (todo._id)}
              <Todo
                {todo}
                isSelected={selectedIds.has(todo._id)}
                on:select={() => handleSelect(todo)}
                on:toggle={() => handleToggle(todo)}
              />
            {/each}
          </ul>
        </div>
        <div class="card-footer border-0 bg-white">
          <form id="form" on:submit|preventDefault={addTodo}>
            <div class="form-group py-2">
              <input
                bind:value={todoInputValue}
                placeholder="Create new todo ..."
                class="form-control"
                autocomplete="off"
                id="input"
                name="title"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  ::global(*) {
    font-family: "Poppins", sans-serif;
  }

  ::global(i) {
    font-size: 30px;
  }

  .spacer {
    flex: 1 1 auto;
  }

  .card-body {
    max-height: 50vh;
    overflow: auto;
  }
</style>
