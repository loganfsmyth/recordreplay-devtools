// Test basic logpoint functionality. When logpoints are added,
// new messages should appear in the correct order and allow time warping.
(async function() {
  const { assert } = Test;

  await Test.selectSource("doc_rr_basic.html");
  await Test.addBreakpoint("doc_rr_basic.html", 20);
  await Test.setBreakpointOptions("doc_rr_basic.html", 20, undefined, {
    logValue: `"Logpoint Number " + number`,
  });
  await Test.addBreakpoint("doc_rr_basic.html", 9, undefined, {
    logValue: `"Logpoint Beginning"`,
  });
  await Test.addBreakpoint("doc_rr_basic.html", 7, undefined, {
    logValue: `"Logpoint Ending"`,
  });

  await Test.selectConsole();

  const messages = await Test.waitForMessageCount("Logpoint", 12);
  assert(!Test.findMessages("Loading").length);

  assert(messages[0].textContent.includes("Beginning"));
  for (let i = 1; i <= 10; i++) {
    assert(messages[i].textContent.includes("Number " + i));
  }
  assert(messages[11].textContent.includes("Ending"));

  await Test.warpToMessage("Number 5");

  await Test.checkEvaluateInTopFrame("number", 5);
  await Test.reverseStepOverToLine(19);

  // The logpoint acts like a breakpoint when resuming.
  await Test.resumeToLine(20);

  Test.finish();
})();
