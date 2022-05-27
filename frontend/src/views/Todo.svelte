<script>
  import { createEventDispatcher } from "svelte";
  import { formatRelative } from "date-fns";

  export let todo;
  export let isSelected = false;

  const dispatch = createEventDispatcher();

  function toggleTodo() {
    dispatch("toggle");
  }

  function selectTodo() {
    dispatch("select");
  }
</script>

<li class="list-group-item border-0">
  <div class="d-flex align-items-center">
    <div style:flex="1">
      <h6>
        <strong>{todo.name}</strong>
      </h6>
      <small class="m-0 text-muted"
        >{formatRelative(Date.parse(todo.createdAt), new Date())}</small
      >
    </div>
    <span class="spacer" />
    <div
      on:click={toggleTodo}
      class="mx-2 text-center text-{todo.completed ? 'success' : 'danger'}"
    >
      <i class="bx bx-{todo.completed ? 'check-circle' : 'error'}" />
    </div>
    <div class="ms-2">
      <div class="form-check">
        <input
          type="checkbox"
          class="form-check-input"
          value={isSelected}
          id="flexCheckDefault"
          on:click={selectTodo}
        />
      </div>
    </div>
  </div>
</li>
