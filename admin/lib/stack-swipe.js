/*
Script Name: StackSwipe
Description: An ultra-simple and elegant card swiping plugin
Version: 1
Author: Will Viles
Author URI: http://vil.es/
*/

(function( $, window, document, undefined ){

  // our plugin constructor
  var StackSwipe = function( elem, options ){
      this.elem = elem;
      this.$elem = $(elem);
      this.$stack = this.$elem.find('.stack-swipe-stack');
      this.$allCards = this.$stack.find('li');
      this.$currentCard = this.$allCards.filter(':first-of-type');
      this.options = $.extend({
        // Defaults
        buttonText: {
          'left': '&larr;',
          'up': '&uarr;',
          'down': '&darr;',
          'right': '&rarr;'
        },
        peek: {
          from: {
            opacity: 0,
            scale: .8
          },
          to: {
            opacity: .5,
            scale: .9
          }
        },
        devMode: false
      }, options);
    };

  // the plugin prototype
  StackSwipe.prototype = {

    // Initialize
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////

    init: function() {

      this.card.setup.call(this);

      return this;
    },

    // Register Cards
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////

    card: {

      // Setup card
      ///////////////////////////////////////////////////////

      setup: function() {
        // Get first card in the stack
        var $allCards = this.$stack.find('li'),
            $firstCard = $allCards.filter(':first-of-type'),
            $nextCard = $allCards.filter(':nth-of-type(2)');

        // If no cards, send cardsExhausted callback
        if (!$firstCard.length > 0) {
          this.$elem.trigger('cardsExhausted');
          this.buttons.setup.call(this, -1);
          return false;
        }

        // Otherwise, let's set up the card

        // Save cards to variables on the plugin
        this.$allCards = $allCards;
        this.$currentCard = $firstCard;
        this.$nextCard = $nextCard;

        // Setup Hammer.js handler
        var card = new Hammer(this.$currentCard[0]),
            availableDirections = this.card.availableDirections.call(this),
            that = this;

        // Setup buttons
        this.buttons.setup.call(this, availableDirections);

        // Animate card in
        this.$currentCard.transition({ opacity: 1, scale: 1 });

        // Set pan & swipe options
        card.get('pan').set({ direction: Hammer.DIRECTION_ALL });
        card.get('swipe').set({ direction: Hammer.DIRECTION_ALL, threshold: 20 });

        // On a successful swipe
        card.on('swipe', function(event) {
          that.card.handleSwipe.call(that, event, availableDirections);
        });

        // Starting the swipe
        card.on('panstart', function(event) {
          that.$nextCard.transition({ opacity: that.options.peek.to.opacity, scale: that.options.peek.to.scale }, function() {
            $(this).addClass('peek');
          });
          that.$elem.trigger('swipeStart');
        });

        // Moving the card
        card.on('panmove', function(event) {
          that.$elem.trigger('swipeMove', {x: event.deltaX, y: event.deltaY});
          that.card.drag.call(that, event.deltaX, event.deltaY);
        });

        // Dropping the card
        card.on('panend', function(event) {
          // If we've got a swipe on the go, don't call panend
          if (that.isSwiping == true) { return false; }

          that.$nextCard.transition({ opacity: that.options.peek.from.opacity, scale: that.options.peek.from.scale }, function() {
            $(this).removeClass('peek');
          });
          that.$elem.trigger('swipeDrop');
          that.card.springBack.call(that);
        });
      },

      // Available Swipe Directions
      availableDirections: function() {
        var card = this.$currentCard,
            defaultDirections = ['left', 'up', 'down', 'right'],
            availableDirections = [];

        $.each(defaultDirections, function(i, direction) {
          if (card.data('swipe-' + direction) == true) {
            availableDirections.push(direction);
          };
        });

        return availableDirections;
      },

      // Drag card
      ///////////////////////////////////////////////////////
      drag: function(x, y) {
        this.$currentCard.css({ translate: [x,y] });
      },

      // Spring back
      ///////////////////////////////////////////////////////
      springBack: function() {
        this.$currentCard.transition({
          x: 0, y: 0
        }, 200, 'easeOutBack');
      },

      // Throw Out
      ///////////////////////////////////////////////////////
      throwOut: function(direction) {

        var stackWidth = this.$elem.width(),
            throwOutHoriz = stackWidth * 1.5, //TODO CHANGED
            stackHeight = this.$elem.height(),
            throwOutVert = stackHeight * 1.5, //TODO CHANGED
            that = this,
            coords;

        switch(direction) {
          case 'up':
            coords = { x: 0, y: -throwOutVert }
            break;
          case 'right':
            coords = { x: throwOutHoriz, y: 0 }
            break;
          case 'down':
            coords = { x: 0, y: throwOutVert }
            break;
          case 'left':
            coords = { x: -throwOutHoriz, y: 0 }
            break;
        }

        this.$currentCard.transition(coords, 200, 'easeOutQuad', function() {
          // Remove card
          that.$currentCard.remove();
          // Return swipe status to false
          that.isSwiping = false;
          // Confirm success
          that.card.swipeSuccess.call(that, that.$currentCard, direction);
        });

      },

      // Handle Swipe
      ///////////////////////////////////////////////////////
      handleSwipe: function(event, availableDirections) {
        var directionKey = event.direction,
            directionKeys = {'8': 'up', '4': 'right', '2': 'left', '16': 'down'},
            direction = directionKeys[directionKey];

        if ($.inArray(direction, availableDirections) !== -1) {
          this.isSwiping = true;
          this.card.throwOut.call(this, direction);
        } else {
          this.card.swipeUnavailable.call(this, direction);
        }
      },

      // Successful swipe
      ///////////////////////////////////////////////////////
      swipeSuccess: function(card, direction) {
        // Send event
        this.$elem.trigger('swipeSuccess', [card, direction]);
        // Setup next card
        this.card.setup.call(this);
      },

      // Unavailable swipe
      ///////////////////////////////////////////////////////
      swipeUnavailable: function(direction) {
        this.$elem.trigger('swipeUnavailable', direction);
        console.error("Unavailable swipe");
      }

    },

    // Buttons
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////

    buttons: {

      // Setup
      ///////////////////////////////////////////////////////
      setup: function(availableDirections) {
        var $StackSwipeBtns = this.$elem.find('.stack-swipe-btns'),
            $buttonList = $StackSwipeBtns.find('ul'),
            btns = '',
            that = this;

        if (availableDirections === -1) {
          $buttonList.html('');
          return false;
        }

        $.each(availableDirections, function(i, direction) {
          var buttonText = that.options.buttonText[direction];

          if ($.isFunction(buttonText)) {
            console.log('is a function');
            buttonText = buttonText.call(that);
          }
          btns = btns + '<li class="' + direction + '" data-direction="' + direction + '">' + buttonText + '</li>';
        });

        $buttonList.html('').append(btns);

        $buttonList.find('li').on('click', function() {
          var direction = $(this).data('direction');
          that.card.throwOut.call(that, direction);
        });
      }

    }


  }; // End of all functions

  $.fn.StackSwipe = function(options) {
    return this.each(function() {
      new StackSwipe(this, options).init();
    });
  };

})( jQuery, window , document );
