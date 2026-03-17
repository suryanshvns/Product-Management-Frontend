"use client";

import { useState } from "react";
import { Settings, Key, Webhook, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { Modal } from "@/components/shared/modal";
import {
  useSettingsList,
  useUpdateSetting,
  useApiKeys,
  useCreateApiKey,
  useWebhooks,
  useCreateWebhook,
} from "../hooks/use-settings";
import { useToast } from "@/hooks/use-toast";

const SCOPE = "global";

export function SettingsView() {
  const { toast } = useToast();
  const [tab, setTab] = useState("general");
  const [scope, setScope] = useState(SCOPE);
  const [editKey, setEditKey] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [apiKeyOpen, setApiKeyOpen] = useState(false);
  const [apiKeyName, setApiKeyName] = useState("");
  const [webhookOpen, setWebhookOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookEvents, setWebhookEvents] = useState("order.created");

  const { data: settingsList, isLoading: settingsLoading, isError: settingsError, refetch: refetchSettings } = useSettingsList({ scope });
  const updateSetting = useUpdateSetting();
  const { data: apiKeysList, isLoading: keysLoading, isError: keysError, refetch: refetchKeys } = useApiKeys();
  const createKey = useCreateApiKey();
  const { data: webhooksList, isLoading: webhooksLoading, isError: webhooksError, refetch: refetchWebhooks } = useWebhooks();
  const createWebhook = useCreateWebhook();

  const settings = Array.isArray(settingsList) ? settingsList : [];
  const apiKeys = Array.isArray(apiKeysList) ? apiKeysList : [];
  const webhooks = Array.isArray(webhooksList) ? webhooksList : [];

  const handleSaveSetting = () => {
    if (!editKey?.trim()) {
      toast({ title: "Key is required", variant: "destructive" });
      return;
    }
    updateSetting.mutate(
      { scope: scope || SCOPE, key: editKey.trim(), value: editValue },
      {
        onSuccess: () => {
          toast({ title: "Setting saved" });
          setEditOpen(false);
          setEditKey("");
          setEditValue("");
          refetchSettings();
        },
        onError: (err) => {
          toast({
            title: "Failed to save",
            description: err?.response?.data?.message ?? err?.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleCreateApiKey = () => {
    if (!apiKeyName?.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    createKey.mutate(
      { name: apiKeyName.trim() },
      {
        onSuccess: () => {
          toast({ title: "API key created" });
          setApiKeyOpen(false);
          setApiKeyName("");
          refetchKeys();
        },
        onError: (err) => {
          toast({
            title: "Failed to create API key",
            description: err?.response?.data?.message ?? err?.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleCreateWebhook = () => {
    if (!webhookUrl?.trim()) {
      toast({ title: "URL is required", variant: "destructive" });
      return;
    }
    const events = webhookEvents.split(",").map((e) => e.trim()).filter(Boolean);
    createWebhook.mutate(
      { url: webhookUrl.trim(), events: events.length ? events : ["order.created"] },
      {
        onSuccess: () => {
          toast({ title: "Webhook created" });
          setWebhookOpen(false);
          setWebhookUrl("");
          setWebhookEvents("order.created");
          refetchWebhooks();
        },
        onError: (err) => {
          toast({
            title: "Failed to create webhook",
            description: err?.response?.data?.message ?? err?.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const openEdit = (item) => {
    setEditKey(item?.key ?? "");
    setEditValue(item?.value ?? "");
    setEditOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={Settings} title="Settings" description="Global settings, API keys, and webhooks." />

      <div className="flex gap-2 border-b border-border">
        <button
          type="button"
          onClick={() => setTab("general")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium ${
            tab === "general" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Settings className="h-4 w-4" />
          General
        </button>
        <button
          type="button"
          onClick={() => setTab("api-keys")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium ${
            tab === "api-keys" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Key className="h-4 w-4" />
          API keys
        </button>
        <button
          type="button"
          onClick={() => setTab("webhooks")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium ${
            tab === "webhooks" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Webhook className="h-4 w-4" />
          Webhooks
        </button>
      </div>

      {tab === "general" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Settings (scope: {scope})</CardTitle>
            <Button size="sm" onClick={() => { setEditKey(""); setEditValue(""); setEditOpen(true); }}>
              Add / Edit
            </Button>
          </CardHeader>
          <CardContent>
            {settingsError ? (
              <ErrorState onRetry={refetchSettings} />
            ) : settingsLoading && !settings.length ? (
              <TableSkeleton rows={4} cols={3} />
            ) : settings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No settings. Use &quot;Add / Edit&quot; to set a key (e.g. theme = dark).</p>
            ) : (
              <div className="space-y-2">
                {settings.map((s, i) => (
                  <div key={s.key ?? i} className="flex items-center justify-between rounded-lg border p-3">
                    <span className="font-mono text-sm">{s.key ?? s.name}</span>
                    <span className="text-muted-foreground">{String(s.value ?? "—")}</span>
                    <Button variant="ghost" size="sm" onClick={() => openEdit(s)}>Edit</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {tab === "api-keys" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">API keys</CardTitle>
            <Button className="gap-2" size="sm" onClick={() => setApiKeyOpen(true)}>
              <Plus className="h-4 w-4" />
              Create key
            </Button>
          </CardHeader>
          <CardContent>
            {keysError ? (
              <ErrorState onRetry={refetchKeys} />
            ) : keysLoading && !apiKeys.length ? (
              <TableSkeleton rows={4} cols={3} />
            ) : apiKeys.length === 0 ? (
              <p className="text-sm text-muted-foreground">No API keys. Create one for CI or external access.</p>
            ) : (
              <div className="space-y-2">
                {apiKeys.map((k) => (
                  <div key={k.id} className="flex items-center justify-between rounded-lg border p-3">
                    <span>{k.name ?? k.id}</span>
                    {k.prefix && <span className="font-mono text-xs text-muted-foreground">{k.prefix}…</span>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {tab === "webhooks" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Webhooks</CardTitle>
            <Button className="gap-2" size="sm" onClick={() => setWebhookOpen(true)}>
              <Plus className="h-4 w-4" />
              Add webhook
            </Button>
          </CardHeader>
          <CardContent>
            {webhooksError ? (
              <ErrorState onRetry={refetchWebhooks} />
            ) : webhooksLoading && !webhooks.length ? (
              <TableSkeleton rows={4} cols={3} />
            ) : webhooks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No webhooks. Add a URL to receive events (e.g. order.created).</p>
            ) : (
              <div className="space-y-2">
                {webhooks.map((w) => (
                  <div key={w.id} className="flex flex-col gap-1 rounded-lg border p-3">
                    <span className="font-mono text-sm text-muted-foreground">{w.url}</span>
                    {Array.isArray(w.events) && w.events.length > 0 && (
                      <span className="text-xs text-muted-foreground">{w.events.join(", ")}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Modal
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Setting"
        description="Set scope, key, and value (e.g. theme = dark)."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveSetting} disabled={updateSetting.isPending}>
              {updateSetting.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input placeholder="Scope" value={scope} onChange={(e) => setScope(e.target.value)} />
          <Input placeholder="Key (e.g. theme)" value={editKey} onChange={(e) => setEditKey(e.target.value)} />
          <Input placeholder="Value (e.g. dark)" value={editValue} onChange={(e) => setEditValue(e.target.value)} />
        </div>
      </Modal>

      <Modal
        open={apiKeyOpen}
        onOpenChange={setApiKeyOpen}
        title="Create API key"
        description="Give the key a name (e.g. CI)."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setApiKeyOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateApiKey} disabled={createKey.isPending}>
              {createKey.isPending ? "Creating…" : "Create"}
            </Button>
          </div>
        }
      >
        <Input placeholder="Name" value={apiKeyName} onChange={(e) => setApiKeyName(e.target.value)} />
      </Modal>

      <Modal
        open={webhookOpen}
        onOpenChange={setWebhookOpen}
        title="Add webhook"
        description="URL and events (comma-separated, e.g. order.created)."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setWebhookOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateWebhook} disabled={createWebhook.isPending}>
              {createWebhook.isPending ? "Creating…" : "Create"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input placeholder="https://webhook.site/xxx" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} />
          <Input placeholder="order.created" value={webhookEvents} onChange={(e) => setWebhookEvents(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
