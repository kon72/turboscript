#include <napi.h>

namespace turboscript {
namespace {

Napi::Value Hello(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  return Napi::String::New(env, "Hello from C++");
}

Napi::Object InitHelloWorldBinding(Napi::Env env, Napi::Object exports) {
  exports.Set("hello", Napi::Function::New(env, Hello));
  return exports;
}

NODE_API_MODULE(hello_world_binding, InitHelloWorldBinding)

}  // namespace
}  // namespace turboscript
