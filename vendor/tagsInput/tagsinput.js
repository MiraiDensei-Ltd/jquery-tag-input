function inputTag(input, options) {

  var defaults = {
    multi: true,
    auto: false,
    source: [],
    color: '#28a745',
    multiColors: ['#4285F4', '#DB4437', '#F4B400', '#0F9D58', '#E91E63', '#9C27B0']
  };
  var params = $.extend({}, defaults, options);
  
  var count = 0;

  input.css('display', 'none');

  var tagDiv = $(document.createElement('div'));
  tagDiv.addClass('tags-container ' + input.attr('class'));
  var newInput = $(document.createElement('input'));
  newInput.addClass('tagInput');
  newInput.attr('type', 'text');
  newInput.attr('placeholder', input.attr('placeholder'));
  tagDiv.append(newInput);
  input.parent().append(tagDiv);

  tagDiv.click(function() {
    newInput.focus();
  });

  /* Add a new tag */
  var addInput = function(value) {
    
    var taglist = newInput.parent().find('.tag-wrapper');
    if (params.multi && taglist.length > 0) {
      for(var i=0; i<taglist.length; i++) {
        if($(taglist[i]).text().slice(0,-1).toLowerCase() == value.toLowerCase()) 
          return;
      }
    }
      
    var tag = $(document.createElement('span'));
    tag.addClass('tag-wrapper');
    tag.text(value);
    var closeTag = $(document.createElement('span'));
    closeTag.html('&#10008;');
    closeTag.click(function() {
      clearInput(value);
      $(this).parent().remove();
    });
    tag.append(closeTag);
    
    /* Update input value */
    input.val(input.val()+value+',').trigger('change');

    /* If muti tags is false then keep only new tag */
    if (!params.multi) {
      tag.css('background-color', params.color);
      while(newInput.parent().find('.tag-wrapper').length > 0)
        newInput.parent().find('.tag-wrapper')[0].remove();
    }
    else {
      tag.css('background-color', params.multiColors[count % params.multiColors.length]);
      count += 1;
    }

    tag.insertBefore(newInput);
  };

  /* Remove last tag */
  var removeInput = function() {
    var taglist = newInput.parent().find('.tag-wrapper');
    if(taglist.length > 0 && newInput.val() === '') {
      taglist[taglist.length - 1].remove();
      var idList = input.val().split(',');
      if (idList.length === 2) {
          input.val('');
      }
      else {
          idList.splice(-2, 1);
          input.val(idList);
      }
    }
  };
  
  function clearInput(name) {
      var id = 0;
      var taglist = newInput.parent().find('.tag-wrapper');
      for (let i=0; i<taglist.length; i++) {
        var text = $(taglist[i]).text().slice(0, -1);
        if (text === name) {
            id = i;
            break;
        } 
      }
      var idList = input.val().split(',');
      if (idList.length === 2) {
          input.val('');
      }
      else {
          idList.splice(id, 1);
          input.val(idList);
      }
  }

  /*  
      Attach autocomplete if set true. 
      Please specify a callback function for suggested items' click function 
  */
  if(params.auto) {
    autocomplete(newInput, params.source, {
      callBack: addInput
    });
    newInput.on('keydown', function(e) {
      var code = e.keyCode || e.which;
      if(code == 8) {
        removeInput();
      }
    });
  }
  else {
    newInput.on('keydown', function(e) {
      var code = e.keyCode || e.which;
      if(code == 13) {
        e.preventDefault();
        addInput(input.val());
      }
      else if(code == 188) {
        e.preventDefault();
        addInput(input.val());
      }
      else if(code == 8) {
        removeInput();
      }
    });
  }

  return newInput;
}

