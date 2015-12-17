(function (root) {
  var STATUS_SHOW_MS = 2000
  var document = root.document

  document.addEventListener('DOMContentLoaded', function () {
    var $useInnerHTML = document.querySelector('[name="useInnerHTML"]')
    var $float = document.querySelector('[name="float"]')
    var $hideIfOutlineDetected = document.querySelector('[name="hideIfOutlineDetected"]')
    var $normalize = document.querySelector('[name="normalize"]')
    var $status = document.querySelector('#status')
    var initStatusTextContent = $status.textContent
    var statusShowTimeout

    function saveOptions () {
      chrome.storage.sync.set({
        useInnerHTML: $useInnerHTML.checked,
        float: $float.checked,
        hideIfOutlineDetected: $hideIfOutlineDetected.checked,
        normalize: $normalize.checked
      }, function () {
        $status.textContent = "Options saved."
        if (statusShowTimeout) clearTimeout(statusShowTimeout)
        statusShowTimeout = setTimeout(function () { $status.textContent = initStatusTextContent }, STATUS_SHOW_MS)
      })
    }

    function restoreOptions () {
      chrome.storage.sync.get({
        // default values
        useInnerHTML: true,
        float: true,
        hideIfOutlineDetected: true,
        normalize: true
      }, function (options) {
        $useInnerHTML.checked = options.useInnerHTML
        $float.checked = options.float
        $hideIfOutlineDetected.checked = options.hideIfOutlineDetected
        $normalize.checked = options.normalize
      })
    }

    [$useInnerHTML, $float, $hideIfOutlineDetected, $normalize].forEach(function ($input) {
      $input.addEventListener('change', function (evt) { saveOptions() })
    })

    restoreOptions()
  })
}(this))
