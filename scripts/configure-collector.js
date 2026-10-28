const MAIN_DIR = process.env.PWD
module.exports.register = function () {
  this.once("contentAggregated", ({ contentAggregate }) => {
    for (const { origins } of contentAggregate) {
      for (const origin of origins) {
        let collector = [
          {
            run:
            {
              command: `${MAIN_DIR}/scripts/render-component-version.js`,
              env: [
                { name: "SRC_DIR", value: './src' },
                { name: "BUILT_DIR", value: './built' },
              ]
            },
            scan: {
              clean: true,
                dir: 'built'
            }
          }
        ]
        Object.assign((origin.descriptor.ext ??= {}), { collector })
      }
    }
  })
}
