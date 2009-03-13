 // $Id$

Drupal.behaviors.taggerpop = function (context) {
  jQuery.each(Drupal.settings['active_tags_popular'], function(i, v) {
    if ($(v).length == 1 && !$(v).hasClass('active-tags-pop-processed')) {
      activetags_popular_activate(v);
      $(v).addClass('active-tags-pop-processed');
    }
  });
}

function activetags_popular_activate(context) {
  var vid = context.substr(20,1);
  $.ajax({
    type: "GET",
    url: Drupal.settings['active_tags_popular_callback'] + '/' + vid,
    dataType: 'json',
    success: function (matches) {
      var tagarea = activetags_popular_widget(context,matches);
      $(context).after(tagarea);
      var str = $(context + ' input.form-text').val();
      $(context).next().children('.tag-popular').children().filter(function (index) {
        return str.indexOf($(this).text()) >= 0;
      }).parent().remove();
      $(context).next().children('.tag-popular').children('.add-tag-popular').click(function () {
        activetags_add(context, $(this).prev().text());
        activetags_update(context);
        $(this).parent().remove();
      });
    },
    error: function (xmlhttp) {
      alert(Drupal.ahahError(xmlhttp, Drupal.settings['active_tags_popular_callback']));
    }
  });
}

function activetags_popular_widget(context,tags) {
  var content = '<div class="pop-tags">Add popular tags: ';
  jQuery.each(tags, function (i, v) {
    tagitem = '<div class="tag-popular"><span class="tag-text">' + v + '</span><span class="add-tag-popular">+</span></div>';
    content = content + tagitem;
  });
  return content + '</div>';
}