/*
  A content script that munges Like buttons.

  Copyright 2011 Ashkan Soltani and Brian Kennish

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  This program is distributed in the hope that it will be useful, but WITHOUT
  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
  FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

  You should have received a copy of the GNU General Public License along with
  this program. If not, see <http://www.gnu.org/licenses/>.

  Authors (one per line):

    Brian Kennish <byoogle@gmail.com>
*/

/* Messages the page and Like+1 state internally and a + or -1 externally. */
function likeplusone(likeplusoned) {
  var page =
      location.href.indexOf(like, 7) >= 7 ?
          decodeURIComponent(location.search.split('href=', 2)[1].split('&', 1))
              : location;
  chrome.extension.sendRequest({page: page, likeplusoned: likeplusoned});
  $('head').append(
    '<script type="text/javascript" src="http://apis.google.com/js/plusone.js"></script>'
  );
  $('body').append(
    '<div class="hidden"><g:plusone href="' + page + '"></g:plusone></div>'
  );

  setTimeout(function() {
    $('[src*="plusone.google.com/u/0/_/+1/button"]').
      attr('src', function(index, source) { return source += '#like+1'; });
  }, timeout);
}

/* The, partial, URL of the Like iframe. */
var like = 'www.facebook.com/plugins/like.php';

/* The +1 timeout, in milliseconds. */
var timeout = 5000;

/* Splits the Like stream and simulates a click on the +1 button. */
$(function() {
  $('[src*="' + like + '"]').addClass('likeplusone');

  $('.connect_widget_like_button').
    click(function() { likeplusone(true); }).
    children('.liketext').html('');

  $('.tombstone_cross').click(function() { likeplusone(); });

  setTimeout(function() {
    if (location.hash.split('#').pop() == 'like+1') {
      // jQuery seems to bite the bag here.
      var click = document.createEvent('MouseEvents');
      click.initMouseEvent('click', true, true);
      document.getElementById('button').dispatchEvent(click);
    }
  }, timeout);
});
