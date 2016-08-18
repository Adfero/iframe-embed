# iFrame Responsive Embed

## Installation

```
# bower install --save iframe-embed
```

## Usage

### Embedded Content

First, initialize the plugin within the embedded content:

```
window.embeddedIFrame({'source':'some-unique-string'});
```

### Embedding Page

Then, on any page that embeds the content as an iFrame, initiate the
corresponding plugin:

```
<iframe src="someEmbeddedContent.html" id="embedded-content"></iframe>
<script>
  window.embedIFrame({'id':'embedded-content','source':'some-unique-string'});
</script>
```
