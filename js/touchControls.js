

const JOY_RADIUS = 50; 

export function initTouchControls(keys) {
  const joystick = document.getElementById('joystick');
  const knob     = document.getElementById('joystickKnob');
  const fireBtn  = document.getElementById('fireBtn');
  if (!joystick || !knob || !fireBtn) return;

  let joyTouchId = null;
  let originX = 0, originY = 0;

  function resetJoystick() {
    joyTouchId = null;
    knob.style.transform = 'translate(0px, 0px)';
    keys['ArrowLeft'] = keys['ArrowRight'] = keys['ArrowUp'] = keys['ArrowDown'] = false;
  }

  function handleMove(touch) {
    const dx = touch.clientX - originX;
    const dy = touch.clientY - originY;
    const dist  = Math.min(Math.hypot(dx, dy), JOY_RADIUS);
    const angle = Math.atan2(dy, dx);
    knob.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;

    const deadzone = 8;
    keys['ArrowLeft']  = dx < -deadzone;
    keys['ArrowRight'] = dx >  deadzone;
    keys['ArrowUp']    = dy < -deadzone;
    keys['ArrowDown']  = dy >  deadzone;
  }

  joystick.addEventListener('touchstart', e => {
    e.preventDefault();
    const t = e.changedTouches[0];
    joyTouchId = t.identifier;
    const rect = joystick.getBoundingClientRect();
    originX = rect.left + rect.width / 2;
    originY = rect.top + rect.height / 2;
    handleMove(t);
  }, { passive: false });

  joystick.addEventListener('touchmove', e => {
    if (joyTouchId === null) return;
    e.preventDefault();
    const t = [...e.changedTouches].find(t => t.identifier === joyTouchId);
    if (t) handleMove(t);
  }, { passive: false });

  ['touchend', 'touchcancel'].forEach(evt =>
    joystick.addEventListener(evt, e => {
      const t = [...e.changedTouches].find(t => t.identifier === joyTouchId);
      if (t) resetJoystick();
    }, { passive: false })
  );

  fireBtn.addEventListener('touchstart', e => { e.preventDefault(); keys['Space'] = true; }, { passive: false });
  ['touchend', 'touchcancel'].forEach(evt =>
    fireBtn.addEventListener(evt, e => { e.preventDefault(); keys['Space'] = false; }, { passive: false })
  );
}