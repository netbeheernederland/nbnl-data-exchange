module.exports.register = function () {
  this.once("contentAggregated", ({ contentAggregate }) => {
    for (const bucket of contentAggregate) {
      if (/^draft-/.test(bucket.version)) {  // Drafts.
        const [_, workName] = /^draft-(.*)$/.exec(bucket.version)
        bucket.displayVersion = `${workName} (draft)`
      }
      else if (!/^\d+\.\d+$/.test(bucket.version)) {  // Releases.
        bucket.prerelease = true
      }
      if (bucket.version == "main") {  // Upcoming.
        bucket.version = "upcoming"
        bucket.displayVersion = "upcoming"
      }
    }
  })
}
