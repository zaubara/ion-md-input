angular.module('ionMdInput', [])

.directive('ionMdInput', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    template: '<label class="item item-input item-md-label">' +
      '<input type="text" class="md-input">' +
      '<span class="input-label"></span>' +
      '<div class="highlight"></div>' +
      '</label>',
    compile: function(element, attr) {

      var highlight = element[0].querySelector('.highlight');
      var highlightColor;
      if (!attr.highlightColor) {
        highlightColor = 'calm';
      } else {
        highlightColor = attr.highlightColor;
      }
      highlight.className += ' highlight-' + highlightColor;

      var label = element[0].querySelector('.input-label');
      label.innerHTML = attr.placeholder;

      /*Start From here*/
      var input = element.find('input');
      angular.forEach({
        'name': attr.name,
        'type': attr.type,
        'ng-value': attr.ngValue,
        'ng-model': attr.ngModel,
        'required': attr.required,
        'ng-required': attr.ngRequired,
        'minlength': attr.minlength,
        'ng-minlength': attr.ngMinlength,
        'maxlength': attr.maxlength,
        'ng-maxlength': attr.ngMaxlength,
        'ng-pattern': attr.ngPattern,
        'ng-change': attr.ngChange,
        'ng-trim': attr.trim,
        'ng-blur': attr.ngBlur,
        'ng-focus': attr.ngFocus,
        'ng-disabled': attr.ngDisabled,
        'pattern': attr.pattern,
        'min': attr.min,
        'max': attr.max,
        'step': attr.step,
        'oninput': attr.oninput,
        'custom-validation': attr.customValidation
      }, function(value, name) {
        if (angular.isDefined(value)) {
          input.attr(name, value);
        }
      });

      var unwatch = null;
      var cleanUp = function() {
        if (unwatch) {
          unwatch();
          unwatch = null;
        }
        ionic.off('$destroy', cleanUp, element[0]);
      };
      // add listener
      ionic.on('$destroy', cleanUp, element[0]);

      return function LinkingFunction($scope, $element) {

        var mdInput = $element[0].querySelector('.md-input');

        var dirtyClass = 'used';

        var reg = new RegExp('(\\s|^)' + dirtyClass + '(\\s|$)');

        //Here is our toggle function
        var toggleClass = function() {
          if (this.value === '') {
            this.className = mdInput.className.replace(reg, ' ');
          } else {
            this.classList.add(dirtyClass);
          }
        };

        //Lets check if there is a value on load
        ionic.DomUtil.ready(function() {
          if (mdInput.value === '') {
            mdInput.className = mdInput.className.replace(reg, ' ');
          } else {
            mdInput.classList.add(dirtyClass);
          }
        });
        // Here we are saying, on 'blur', call toggleClass, on mdInput
        ionic.on('blur', toggleClass, mdInput);

        // Watch the input value to call toggleClass when it changes
        // via code
        unwatch = $scope.$watch(function(scope) {
            return mdInput.value;
          }, function(oldValue, newValue) {
          if (oldValue !== newValue) {
            toggleClass.apply(mdInput);
          }
        });
      };

    }
  };
});
