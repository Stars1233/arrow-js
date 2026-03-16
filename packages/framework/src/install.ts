import {
  installAsyncComponentInstaller,
} from '../../core/src/component'
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
