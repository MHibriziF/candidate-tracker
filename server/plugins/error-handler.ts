export default defineNitroPlugin((nitroApp) => {

  nitroApp.hooks.hook('error', (error, event) => {

    const cause = (error as any).__cause

    console.error('\n===== ERROR =====')
    console.error('Path   :', event?.path)
    console.error('Message:', error.message)

    if (cause) {
      console.error('\n Root Cause:')
      console.error(cause)
    }

    console.error('\n Stack:')
    console.error(error.stack)

    console.error('===================\n')
  })

})
