
'use strict'

module.exports.register = function ({ config }) {
  const artifactsDir = (config.artifactsDir || '')
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '')

  if (artifactsDir.split('/').some((part) => part === '..')) {
    throw new Error('post-process: artifacts_dir must not contain ".."')
  }

  this.on('beforePublish', ({ contentCatalog, siteCatalog }) => {
    // Create an empty .nojekyll file at the site root.
    siteCatalog.addFile({
      contents: Buffer.alloc(0),
      out: { path: '.nojekyll' },
    })

    // No configured directory means there is nothing to copy.
    if (!artifactsDir) return

    const sourcePrefix = `${artifactsDir}/`
    const outputSegment = `/_attachments/${artifactsDir}/`

    const attachments = contentCatalog
      .findBy({ component: 'ROOT', family: 'attachment' })
      .filter((file) =>
        file.src.relative.startsWith(sourcePrefix) && file.out
      )

    for (const attachment of attachments) {
      const sourcePath = attachment.out.path
      const segmentIndex = sourcePath.indexOf(outputSegment)

      // Only copy files whose published paths contain the expected
      // _attachments/<artifactsDir>/ directory structure.
      if (segmentIndex === -1) continue

      const targetPath =
        sourcePath.slice(0, segmentIndex + 1) +
        sourcePath.slice(segmentIndex + outputSegment.length)

      siteCatalog.addFile({
        contents: attachment.contents,
        out: { path: targetPath },
      })
    }
  })
}
