import {
  mutations,
  Recording,
  setupRecording,
  SetupRecordingInput,
} from '@jupiterone/integration-sdk-testing';

export { Recording };

export function setupDatabricksRecording(
  input: Omit<SetupRecordingInput, 'mutateEntry'>,
): Recording {
  return setupRecording({
    mutateEntry: mutations.unzipGzippedRecordingEntry,
    ...input,
  });
}
