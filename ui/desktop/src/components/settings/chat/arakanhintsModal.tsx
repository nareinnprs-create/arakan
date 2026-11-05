import { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Check } from '../../icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { errorMessage } from '../../../utils/conversionUtils';
import { defineMessages, useIntl } from '../../../i18n';

const i18n = defineMessages({
  dialogTitle: {
    id: 'arakanhintsModal.dialogTitle',
    defaultMessage: 'Configure Project Hints (.arakanhints)',
  },
  dialogDescription: {
    id: 'arakanhintsModal.dialogDescription',
    defaultMessage:
      'Provide additional context about your project to improve communication with Arakan',
  },
  helpText1: {
    id: 'arakanhintsModal.helpText1',
    defaultMessage:
      '.arakanhints is a text file used to provide additional context about your project and improve the communication with Arakan.',
  },
  helpText2: {
    id: 'arakanhintsModal.helpText2',
    defaultMessage:
      "Please make sure {bold} extension is enabled in the extensions page. This extension is required to use .arakanhints. You'll need to restart your session for .arakanhints updates to take effect.",
  },
  helpText3: {
    id: 'arakanhintsModal.helpText3',
    defaultMessage: 'See {link} for more information.',
  },
  helpTextLink: {
    id: 'arakanhintsModal.helpTextLink',
    defaultMessage: 'using .arakanhints',
  },
  errorReading: {
    id: 'arakanhintsModal.errorReading',
    defaultMessage: 'Error reading .arakanhints file: {error}',
  },
  fileFound: {
    id: 'arakanhintsModal.fileFound',
    defaultMessage: '.arakanhints file found at: {filePath}',
  },
  fileCreating: {
    id: 'arakanhintsModal.fileCreating',
    defaultMessage: 'Creating new .arakanhints file at: {filePath}',
  },
  placeholder: {
    id: 'arakanhintsModal.placeholder',
    defaultMessage: 'Enter project hints here...',
  },
  savedSuccessfully: {
    id: 'arakanhintsModal.savedSuccessfully',
    defaultMessage: 'Saved successfully',
  },
  close: {
    id: 'arakanhintsModal.close',
    defaultMessage: 'Close',
  },
  saving: {
    id: 'arakanhintsModal.saving',
    defaultMessage: 'Saving...',
  },
  save: {
    id: 'arakanhintsModal.save',
    defaultMessage: 'Save',
  },
  failedToAccess: {
    id: 'arakanhintsModal.failedToAccess',
    defaultMessage: 'Failed to access .arakanhints file',
  },
  failedToSave: {
    id: 'arakanhintsModal.failedToSave',
    defaultMessage: 'Failed to save .arakanhints file',
  },
  developer: {
    id: 'arakanhintsModal.developer',
    defaultMessage: 'Developer',
  },
});

const HelpText = () => {
  const intl = useIntl();

  return (
    <div className="text-sm flex-col space-y-4 text-text-secondary">
      <p>{intl.formatMessage(i18n.helpText1)}</p>
      <p>
        {intl.formatMessage(i18n.helpText2, {
          bold: <span className="font-bold">{intl.formatMessage(i18n.developer)}</span>,
        })}
      </p>
      <p>
        {intl.formatMessage(i18n.helpText3, {
          link: (
            <Button
              variant="link"
              className="text-blue-500 hover:text-blue-600 p-0 h-auto"
              onClick={() =>
                window.open(
                  'https://arakan-docs.ai/docs/guides/using-arakanhints/',
                  '_blank'
                )
              }
            >
              {intl.formatMessage(i18n.helpTextLink)}
            </Button>
          ),
        })}
      </p>
    </div>
  );
};

const ErrorDisplay = ({ error }: { error: Error }) => {
  const intl = useIntl();

  return (
    <div className="text-sm text-text-secondary">
      <div className="text-red-600">
        {intl.formatMessage(i18n.errorReading, { error: errorMessage(error) })}
      </div>
    </div>
  );
};

const FileInfo = ({ filePath, found }: { filePath: string; found: boolean }) => {
  const intl = useIntl();

  return (
    <div className="text-sm font-medium mb-2">
      {found ? (
        <div className="text-green-600">
          <Check className="w-4 h-4 inline-block" />{' '}
          {intl.formatMessage(i18n.fileFound, { filePath })}
        </div>
      ) : (
        <div>{intl.formatMessage(i18n.fileCreating, { filePath })}</div>
      )}
    </div>
  );
};

interface ArakanhintsModalProps {
  directory: string;
  setIsArakanhintsModalOpen: (isOpen: boolean) => void;
}

export const ArakanhintsModal = ({ directory, setIsArakanhintsModalOpen }: ArakanhintsModalProps) => {
  const intl = useIntl();
  const arakanhintsFilePath = `${directory}/.arakanhints`;
  const [arakanhintsFile, setArakanhintsFile] = useState<string>('');
  const [arakanhintsFileFound, setArakanhintsFileFound] = useState<boolean>(false);
  const [arakanhintsFileReadError, setArakanhintsFileReadError] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchArakanhintsFile = async () => {
      try {
        const { file, error, found } = await window.electron.readArakanhints();
        setArakanhintsFile(file);
        setArakanhintsFileFound(found);
        setArakanhintsFileReadError(error ?? '');
      } catch (error) {
        console.error('Error fetching .arakanhints file:', error);
        setArakanhintsFileReadError(intl.formatMessage(i18n.failedToAccess));
      }
    };
    if (directory) fetchArakanhintsFile();
  }, [directory, intl]);

  const writeFile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const saved = await window.electron.writeArakanhints(arakanhintsFile);
      if (!saved) {
        throw new Error('Unable to save .arakanhints');
      }
      setSaveSuccess(true);
      setArakanhintsFileFound(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error writing .arakanhints file:', error);
      setArakanhintsFileReadError(intl.formatMessage(i18n.failedToSave));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => setIsArakanhintsModalOpen(open)}>
      <DialogContent className="w-[80vw] max-w-[80vw] sm:max-w-[80vw] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{intl.formatMessage(i18n.dialogTitle)}</DialogTitle>
          <DialogDescription>{intl.formatMessage(i18n.dialogDescription)}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pt-2 pb-4">
          <HelpText />

          <div>
            {arakanhintsFileReadError ? (
              <ErrorDisplay error={new Error(arakanhintsFileReadError)} />
            ) : (
              <div className="space-y-2">
                <FileInfo filePath={arakanhintsFilePath} found={arakanhintsFileFound} />
                <textarea
                  value={arakanhintsFile}
                  className="w-full h-80 border rounded-md p-2 text-sm resize-none bg-background-primary text-text-primary border-border-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(event) => setArakanhintsFile(event.target.value)}
                  placeholder={intl.formatMessage(i18n.placeholder)}
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          {saveSuccess && (
            <span className="text-green-600 text-sm flex items-center gap-1 mr-auto">
              <Check className="w-4 h-4" />
              {intl.formatMessage(i18n.savedSuccessfully)}
            </span>
          )}
          <Button variant="outline" onClick={() => setIsArakanhintsModalOpen(false)}>
            {intl.formatMessage(i18n.close)}
          </Button>
          <Button onClick={writeFile} disabled={isSaving}>
            {isSaving ? intl.formatMessage(i18n.saving) : intl.formatMessage(i18n.save)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
