# pylint: disable=pointless-statement
{
  'targets': [
    {
      'target_name': '<(module_name)',
      'sources': ['binding/hello_world_binding.cc'],
      'include_dirs': ["<!(node -p \"require('node-addon-api').include_dir\")"],
      'cflags!': ['-fno-exceptions'],
      'cflags_cc!': ['-fno-exceptions'],
      'defines': [
        'NAPI_DISABLE_CPP_EXCEPTIONS',
        'NODE_ADDON_API_ENABLE_MAYBE',
      ],
      'conditions': [[
        'OS=="mac"',
        {
          'cflags+': ['-fvisibility=hidden'],
          'xcode_settings': {
            'GCC_SYMBOLS_PRIVATE_EXTERN': 'YES',  # -fvisibility=hidden
          }
        }
      ]]
    },
    {
      'target_name': 'action_after_build',
      'type': 'none',
      'dependencies': ['<(module_name)'],
      'copies': [{
        'files': ['<(PRODUCT_DIR)/<(module_name).node'],
        'destination': '<(module_path)'
      }]
    }
  ],
  'defines': ['NAPI_VERSION=<(napi_build_version)']
}
