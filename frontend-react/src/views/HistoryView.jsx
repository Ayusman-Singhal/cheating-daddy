import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui';

export const HistoryView = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <CardHeader>
          <CardTitle>Conversation History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your conversation history will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
};
