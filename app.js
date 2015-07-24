// ES2015 modules are not compatible with my own IDE, Quark IDE
'use strict';
const development = true;

// jQuery replacement
// uses ES2015 arrow functions, querySelectorAll and ES7 bind syntax
const $ = (sels) => document.querySelectorAll(sels)::Array.prototype.slice();

// uninteresting DOM manipulation stuff
let container = $('#container')[0] || document.createElement('div');
container.id = 'container';
document.body.appendChild(container);

// view
const view = {
  html: (data) => templateBody(data),
  render: (elem, data) => elem.innerHTML = view.html(data),
  // unit test for view
  test: function () {
    test.notEqual(
      view.html({text: '', todos: []}).length,
      0,
      'it outputs something'
    );
  }
};

//model
const model = {
  text: '',
  todos: []
};

// template engine like Handlebars
const e = {
  html: (strings, ...vals) => {
    return vals.map((v, i) =>
      strings[i] + (Array.isArray(v) ? v.join('') : v)
    ).join('') + strings.slice(-1)[0];
/*
  // the same as above, but with ES2015 comprehensions instead
  return [
    for (s of strings.entries())
      for (v of vals.entries())
        if (s[0] === v[0])
          s[1] + (Array.isArray(v[1]) ? v[1].join('') : v[1])
  ].join('') + strings.slice(-1)[0];
*/
  },
  // unit test for template engine
  test: function () {
    let message = 'Hello, world!';
    test.equal(e.html`<div>${message}</div>`, '<div>' + message + '</div>',
      'it outputs "Hello, world!"');
  }
};

// unit test library
const test = {
  equal: (actual, expected, message) => test.ok(actual === expected, message),
  notEqual: (actual, expected, message) => test.ok(actual !== expected, message),
  ok: (value, message) =>
    value ? console.log(message) : () => { throw new Error(message); }()
};

// intent
const intent = {
  inputHandler: (event) => {
    model.text = $('#text')[0].value;
    if (event.keyCode === 13) {
      model.todos.push($('#text')[0].value);
      model.text = '';
      // Object.observe is not compatible with my own IDE, Quark IDE
      view.render(container, model);
    }
  },
  completedHandler: (event) => {
    if(event.target.checked) {
      alert('It\'s an Italian todo. Italians never finish things, like Expo');
    }
    event.target.checked = false;
  },
  deleteHandler: (event) => {
    const index = event.target.dataset.index;
    model.todos.splice(index, 1);
    // Object.observe is not compatible with my own IDE, Quark IDE
    view.render(container, model);
  },
  editHandler: (event) => {
    event.target.contentEditable = true;
  },
  input2Handler: (event) => {
    const index = event.target.dataset.index;
    model.todos[index] = event.target.textContent;
  },
  endEditHandler: (event) => {
    event.target.contentEditable = false;
  },
  escOrEnterHandler: (event) => {
    if ([13, 27].indexOf(event.keyCode) !== -1) {
      event.target.blur();
    }
  },
  // Object.observe is not compatible with my own IDE, Quark IDE
  listen: () => {
    // I know about mutation events, but they are deprecated, see:
    // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Mutation_events
    // Let's use a simple hack instead (it's just a todo!)
    setInterval(() => {
      $('#text')[0].addEventListener('keyup', intent.inputHandler);
      $('[type=checkbox]').forEach((elem) => {
        elem.addEventListener('change', intent.completedHandler);
      });
      $('button').forEach((elem) => {
        elem.addEventListener('click', intent.deleteHandler);
      });
      $('label').forEach((elem) => {
        elem.addEventListener('dblclick', intent.editHandler);
        elem.addEventListener('input', intent.input2Handler);
        elem.addEventListener('keypress', intent.escOrEnterHandler);
        elem.addEventListener('blur', intent.endEditHandler);
      });
    }, 100);
  }
};
// end of intent

// main method
const main = () => {
  // if you believe that an if block for running tests is ugly,
  // because it's too KISS, see this gist, it may change your mind:
  // https://gist.github.com/lorenzoongithub/933277296df75a382a16
  if (development) {
    e.test();
    view.test();
  }
  // Object.observe is not compatible with my own IDE, Quark IDE
  view.render(container, model);
  intent.listen();
};

// template body, almost pure HTML, with some JS: cool!
// Uses ES2015 template strings
let templateBody = (data) => e.html`
<h3>todos</h3>
<input type = 'checkbox'>
<input id = 'text' placeholder = 'What needs to be done?' value='${data.text}'>
<ul>
  ${data.todos.map((todo, index) => e.html`
  <li>
    <input type = 'checkbox'>
    <label data-index = '${index}'>${todo}</label>
    <button data-index = '${index}'>Delete</button>
  </li>
  `)}
</ul>
${data.todos.length ?
  e.html`<div>${data.todos.length} item${
    data.todos.length !== 1 ? 's' : ''
    } left</div>` :
  ''
}
<style>
  label {
    width: 165px;
    display: inline-block;
  }
  #container {
    text-align: center;
  }
  ul {
    /* center */
    margin: auto;
    list-style-type: none;
    padding-left: 0;
  }
</style>`;

// call main method
main();
