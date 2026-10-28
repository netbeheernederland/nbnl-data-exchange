module.exports.register = function () {
  this.once("contentAggregated", ({ contentAggregate }) => {
    for (const bucket of contentAggregate) {
      if (/^draft-/.test(bucket.version)) {  // Draft.
        const [_, workName] = /^draft-(.*)$/.exec(bucket.version)
        bucket.displayVersion = `${workName} (draft)`
      }
      if (!/^\d+\.\d+$/.test(bucket.version)) {  // Release.
        bucket.prerelease = true
      }
      if (bucket.version == "main") { // Upcoming.
        bucket.version = "upcoming"
        bucket.displayVersion = "upcoming"
      }
    }
  })
}
