import { installAsyncComponentInstaller } from '@arrow-js/core/internal'
import { asyncComponent } from './async'

let installed = false

export function installFrameworkRuntime() {
  if (installed) {
    return
  }

  installAsyncComponentInstaller(
    asyncComponent as unknown as Parameters<typeof installAsyncComponentInstaller>[0]
  )
  installed = true
}

installFrameworkRuntime()
