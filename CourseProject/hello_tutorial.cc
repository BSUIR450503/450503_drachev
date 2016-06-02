// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include <stdio.h>
#include <stdlib.h>

#include "ppapi/c/ppb_image_data.h"
#include "ppapi/cpp/graphics_2d.h"
#include "ppapi/cpp/image_data.h"
#include "ppapi/cpp/input_event.h"
#include "ppapi/cpp/instance.h"
#include "ppapi/cpp/module.h"
#include "ppapi/cpp/point.h"
#include "ppapi/utility/completion_callback_factory.h"

#ifdef _WIN32
#undef PostMessage
// Allow 'this' in initializer list
#pragma warning(disable : 4355)
#endif

namespace {

static const int kMouseRadius = 2;

uint32_t MakeColor(uint8_t r, uint8_t g, uint8_t b) {
  uint8_t a = 255;
  PP_ImageDataFormat format = pp::ImageData::GetNativeImageDataFormat();
  if (format == PP_IMAGEDATAFORMAT_BGRA_PREMUL) {
    return (a << 24) | (r << 16) | (g << 8) | b;
  } else {
    return (a << 24) | (b << 16) | (g << 8) | r;
  }
}

}  // namespace

class Graphics2DInstance : public pp::Instance {
 public:
  explicit Graphics2DInstance(PP_Instance instance)
      : pp::Instance(instance),
        callback_factory_(this),
        mouse_down_(false),
        buffer_(NULL),
        device_scale_(1.0f) {}

  ~Graphics2DInstance() { delete[] buffer_; }

  virtual bool Init(uint32_t argc, const char* argn[], const char* argv[]) {
    RequestInputEvents(PP_INPUTEVENT_CLASS_MOUSE);

    unsigned int seed = 1;
    srand(seed);
    myPalette = MakeColor(255,0,0);
    return true;
  }

  virtual void DidChangeView(const pp::View& view) {
  if(context_.is_null()){
    device_scale_ = view.GetDeviceScale();
    pp::Size new_size = pp::Size(view.GetRect().width() * device_scale_,
                                 view.GetRect().height() * device_scale_);

    if (!CreateContext(new_size))
      return;

    // When flush_context_ is null, it means there is no Flush callback in
    // flight. This may have happened if the context was not created
    // successfully, or if this is the first call to DidChangeView (when the
    // module first starts). In either case, start the main loop.
    if (flush_context_.is_null())
      MainLoop(0);
      }
  }

  virtual bool HandleInputEvent(const pp::InputEvent& event) {
    if (!buffer_)
      return true;

    if (event.GetType() == PP_INPUTEVENT_TYPE_MOUSEDOWN ||
        event.GetType() == PP_INPUTEVENT_TYPE_MOUSEMOVE) {
      pp::MouseInputEvent mouse_event(event);

      if (mouse_event.GetButton() == PP_INPUTEVENT_MOUSEBUTTON_NONE)
        return true;

      mouse_ = pp::Point(mouse_event.GetPosition().x() * device_scale_,
                         mouse_event.GetPosition().y() * device_scale_);
      mouse_down_ = true;
      DrawMouse();
    }

    if (event.GetType() == PP_INPUTEVENT_TYPE_MOUSEUP)
      mouse_down_ = false;

    return true;
  }

 private:
  bool CreateContext(const pp::Size& new_size) {
    const bool kIsAlwaysOpaque = true;
    context_ = pp::Graphics2D(this, new_size, kIsAlwaysOpaque);
    // Call SetScale before BindGraphics so the image is scaled correctly on
    // HiDPI displays.
    context_.SetScale(1.0f / device_scale_);
    if (!BindGraphics(context_)) {
      fprintf(stderr, "Unable to bind 2d context!\n");
      context_ = pp::Graphics2D();
      return false;
    }

    // Allocate a buffer of palette entries of the same size as the new context.
    buffer_ = new uint8_t[new_size.width() * new_size.height()];
    size_ = new_size;

    return true;
  }

  void DrawMouse() {
    if (!mouse_down_)
      return;

    int width = size_.width();
    int height = size_.height();

    // Draw a circle at the mouse position.
    int radius = kMouseRadius * device_scale_;
    int cx = mouse_.x();
    int cy = mouse_.y();
    int minx = cx - radius <= 0 ? 1 : cx - radius;
    int maxx = cx + radius >= width ? width - 1 : cx + radius;
    int miny = cy - radius <= 0 ? 1 : cy - radius;
    int maxy = cy + radius >= height ? height - 1 : cy + radius;
    for (int y = miny; y < maxy; ++y) {
      for (int x = minx; x < maxx; ++x) {
        if ((x - cx) * (x - cx) + (y - cy) * (y - cy) < radius * radius)
          buffer_[y * width + x] = 255;
      }
    }
    // See the comment above the call to ReplaceContents below.
    PP_ImageDataFormat format = pp::ImageData::GetNativeImageDataFormat();
    const bool kDontInitToZero = false;
    pp::ImageData image_data(this, format, size_, kDontInitToZero);

    uint32_t* data = static_cast<uint32_t*>(image_data.data());
    if (!data)
       return;

    uint32_t num_pixels = size_.width() * size_.height();
    size_t offset = 0;
    for (uint32_t i = 0; i < num_pixels; ++i) {
        if(buffer_[offset] == 255)
            data[offset] = myPalette;
        offset++;
    }
    context_.ReplaceContents(&image_data);
  }

  void MainLoop(int32_t) {
    if (context_.is_null()) {
      // The current Graphics2D context is null, so updating and rendering is
      // pointless. Set flush_context_ to null as well, so if we get another
      // DidChangeView call, the main loop is started again.
      flush_context_ = context_;
      return;
    }

    DrawMouse();
    // Store a reference to the context that is being flushed; this ensures
    // the callback is called, even if context_ changes before the flush
    // completes.
    flush_context_ = context_;
    context_.Flush(
        callback_factory_.NewCallback(&Graphics2DInstance::MainLoop));
  }

  pp::CompletionCallbackFactory<Graphics2DInstance> callback_factory_;
  pp::Graphics2D context_;
  pp::Graphics2D flush_context_;
  pp::Size size_;
  pp::Point mouse_;
  bool mouse_down_;
  uint8_t* buffer_;
  uint32_t myPalette;
  float device_scale_;
};

class Graphics2DModule : public pp::Module {
 public:
  Graphics2DModule() : pp::Module() {}
  virtual ~Graphics2DModule() {}

  virtual pp::Instance* CreateInstance(PP_Instance instance) {
    return new Graphics2DInstance(instance);
  }
};

namespace pp {
Module* CreateModule() { return new Graphics2DModule(); }
}  // namespace pp
